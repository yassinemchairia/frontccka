// src/app/Chat/chat/chat.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ChatService, ChatMessageDTO, Utilisateur } from '../../Service/chat.service';
import { AuthService } from '../../Service/auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  chatForm: FormGroup;
  searchForm: FormGroup;
  messages: ChatMessageDTO[] = [];
  connectedUsers: Utilisateur[] = [];
  filteredUsers: Utilisateur[] = [];
  selectedUser: Utilisateur | null = null;
  currentUserId: number | null = null;
  messageImageUrls: { [key: string]: SafeUrl } = {};
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private chatService: ChatService,
    private authService: AuthService,
    private toastrService: NbToastrService,
    private changeDetector: ChangeDetectorRef,
    private sanitizer: DomSanitizer // Properly inject DomSanitizer
  ) {
    this.chatForm = this.fb.group({
      message: ['', [Validators.maxLength(500)]]
    });

    this.searchForm = this.fb.group({
      searchQuery: ['']
    });
  }

  ngOnInit(): void {
    console.log('[ChatComponent] Initializing chat component');
    this.setupCurrentUser();
    this.setupConnectedUsers();
    this.setupMessages();
    this.setupSearch();
  }

  private setupSearch(): void {
    this.searchForm.get('searchQuery')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(query => {
        this.filterUsers(query);
      });
  }

  private filterUsers(query: string): void {
    if (!query) {
      this.filteredUsers = [...this.connectedUsers];
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    this.filteredUsers = this.connectedUsers.filter(user => 
      user.prenom.toLowerCase().includes(lowerCaseQuery) ||
      user.nom.toLowerCase().includes(lowerCaseQuery) ||
      user.role.toLowerCase().includes(lowerCaseQuery) ||
      user.email.toLowerCase().includes(lowerCaseQuery)
    );
  }

  private setupConnectedUsers(): void {
    this.chatService.getConnectedUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          console.log('[ChatComponent] Received connected users:', users);
          this.connectedUsers = users.filter(user => user.idUser !== this.currentUserId);
          this.filteredUsers = [...this.connectedUsers];
          
          if (this.selectedUser && !this.connectedUsers.some(u => u.idUser === this.selectedUser?.idUser)) {
            console.log('[ChatComponent] Selected user disconnected, resetting selection');
            this.selectedUser = null;
            this.messages = [];
          }
          this.changeDetector.detectChanges();
        },
        error: (err) => {
          console.error('[ChatComponent] Error receiving connected users:', err);
          this.toastrService.danger('Erreur lors de la récupération des utilisateurs connectés', 'Erreur');
        }
      });
  }

  private setupCurrentUser(): void {
    this.authService.currentUserId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(id => {
        console.log('[ChatComponent] Current user ID updated:', id);
        this.currentUserId = id;
        this.changeDetector.detectChanges();
      });
  }

  private setupMessages(): void {
    this.chatService.getMessages()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (allMessages) => {
          console.log('[ChatComponent] Received messages update:', allMessages);
          if (this.selectedUser) {
            this.messages = allMessages.filter(msg =>
              (msg.senderId === this.currentUserId && msg.receiverId === this.selectedUser?.idUser) ||
              (msg.senderId === this.selectedUser?.idUser && msg.receiverId === this.currentUserId)
            );
            this.messages.forEach(message => {
              if (message.filePath && message.fileType?.startsWith('image/')) {
                this.loadImage(message.filePath);
              }
            });
          } else {
            this.messages = [];
          }
          console.log('[ChatComponent] Filtered messages:', this.messages);
          this.changeDetector.detectChanges();
        },
        error: (err) => {
          console.error('[ChatComponent] Error receiving messages:', err);
          this.toastrService.danger('Erreur lors de la réception des messages', 'Erreur');
        }
      });
  }

  private loadImage(filePath: string): void {
    this.chatService.downloadFile(filePath)
      .subscribe({
        next: (blob) => {
          const objectUrl = URL.createObjectURL(blob);
          this.messageImageUrls[filePath] = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
          this.changeDetector.detectChanges();
        },
        error: (err) => {
          console.error('[ChatComponent] Error loading image:', err);
          this.toastrService.danger('Erreur lors du chargement de l\'image', 'Erreur');
        }
      });
  }

  downloadFile(filePath: string, fileName: string): void {
    this.chatService.downloadFile(filePath)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('[ChatComponent] Error downloading file:', err);
          this.toastrService.danger('Erreur lors du téléchargement du fichier', 'Erreur');
        }
      });
  }

  selectUser(user: Utilisateur): void {
    console.log('[ChatComponent] User selected:', user);
    this.selectedUser = user;
    this.loadChatHistory();
    this.changeDetector.detectChanges();
  }

  sendMessage(): void {
    if (this.chatForm.valid && this.selectedUser && this.currentUserId) {
      const content = this.chatForm.get('message')?.value;
      if (content) {
        console.log('[ChatComponent] Sending message to user:', this.selectedUser.idUser, 'content:', content);
        this.chatService.sendMessage(this.selectedUser.idUser, content);
        this.chatForm.reset();
        this.changeDetector.detectChanges();
      }
    } else {
      console.error('[ChatComponent] Cannot send message - form invalid or no user selected');
      this.toastrService.danger('Impossible d\'envoyer le message. Vérifiez votre sélection ou connexion.', 'Erreur');
    }
  }

  triggerFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    } else {
      console.error('[ChatComponent] File input not found');
      this.toastrService.danger('Erreur: Champ de fichier introuvable', 'Erreur');
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0 && this.selectedUser && this.currentUserId) {
      const file = input.files[0];
      if (file.size > 10 * 1024 * 1024) {
        this.toastrService.danger('Le fichier est trop volumineux (limite: 10MB)', 'Erreur');
        return;
      }

      this.chatService.uploadFile(this.selectedUser.idUser, file)
        .subscribe({
          next: (messageDTO) => {
            console.log('[ChatComponent] File uploaded successfully, received DTO:', messageDTO);
            // Optimistically add the file message to the messages array
            if (this.selectedUser && messageDTO.senderId === this.currentUserId && messageDTO.receiverId === this.selectedUser.idUser) {
              this.messages = [...this.messages, messageDTO];
              if (messageDTO.filePath && messageDTO.fileType?.startsWith('image/')) {
                this.loadImage(messageDTO.filePath);
              }
              this.changeDetector.detectChanges();
            }
            this.loadChatHistory(); // Refresh chat history to ensure consistency
            input.value = '';
          },
          error: (err) => {
            console.error('[ChatComponent] Error uploading file:', err);
            this.toastrService.danger('Erreur lors de l\'envoi du fichier', 'Erreur');
          }
        });
    }
  }

  private loadChatHistory(): void {
    if (this.currentUserId && this.selectedUser) {
      console.log('[ChatComponent] Loading chat history with user:', this.selectedUser.idUser);
      this.chatService.fetchChatHistory(this.currentUserId, this.selectedUser.idUser)
        .subscribe({
          next: (history) => {
            console.log('[ChatComponent] Received chat history:', history.length, 'messages');
            this.messages = history.filter(msg =>
              (msg.senderId === this.currentUserId && msg.receiverId === this.selectedUser?.idUser) ||
              (msg.senderId === this.selectedUser?.idUser && msg.receiverId === this.currentUserId)
            );
            console.log('[ChatComponent] Filtered chat history:', this.messages.length, 'messages');
            this.changeDetector.detectChanges();
          },
          error: (err) => {
            console.error('[ChatComponent] Error fetching chat history:', err);
            this.toastrService.danger('Erreur lors du chargement de l\'historique des messages', 'Erreur');
          }
        });
    }
  }

  scrollToBottom(): void {
    try {
      const messagesContainer = document.querySelector('.messages-container');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    console.log('[ChatComponent] Destroying component');
    Object.values(this.messageImageUrls).forEach(url => {
      if (typeof url === 'string') {
        URL.revokeObjectURL(url);
      }
    });
    this.destroy$.next();
    this.destroy$.complete();
  }
}
