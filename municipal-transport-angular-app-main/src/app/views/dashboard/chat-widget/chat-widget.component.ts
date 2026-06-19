import { ChangeDetectorRef, Component, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-chat-widget',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.scss']
})
export class ChatWidgetComponent {

  private http = inject(HttpClient);
  private cdr  = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  private apiUrl = 'http://localhost:8081/api/chat';

  open = false;
  loading = false;
  userInput = '';
  messages: ChatMessage[] = [
    {
      role: 'assistant',
      content: 'Bonjour 👋 Je suis l\'assistant Municipal Transport. Posez-moi une question sur vos données : chauffeurs, véhicules, tickets, affectations…'
    }
  ];

  suggestions = [
    'Combien de chauffeurs ?',
    'Combien de tickets vendus ?',
    'Combien de véhicules disponibles ?',
    'Quel est le revenu total ?',
    'Combien d\'affectations actives ?'
  ];

  toggle(): void {
    this.open = !this.open;
  }

  ask(prompt?: string): void {
    const text = (prompt ?? this.userInput).trim();
    if (!text || this.loading) return;

    // ⚠️ Toujours créer une NOUVELLE référence de tableau pour que la
    // détection de changement Angular re-render la liste de messages
    this.messages = [...this.messages, { role: 'user', content: text }];
    this.userInput = '';
    this.loading = true;
    this.cdr.detectChanges();

    console.log('[chat] →', text);

    this.http.post<{ reply: string }>(this.apiUrl, { message: text }).subscribe({
      next: (resp) => {
        console.log('[chat] ← réponse reçue:', resp);
        // Forcer l'exécution dans la zone Angular (au cas où l'observable s'exécute hors zone)
        this.zone.run(() => {
          this.messages = [
            ...this.messages,
            { role: 'assistant', content: resp?.reply ?? '(réponse vide)' }
          ];
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('[chat] ✗ erreur:', err);
        this.zone.run(() => {
          this.messages = [
            ...this.messages,
            { role: 'assistant', content: '❌ Erreur de communication avec le serveur. (' + (err?.message ?? 'inconnue') + ')' }
          ];
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  onEnter(event: Event): void {
    event.preventDefault();
    this.ask();
  }
}
