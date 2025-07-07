import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';

export interface SocketUser {
  id: number;
  username: string;
  socketId: string;
}

export class SocketManager {
  private io: SocketIOServer | null = null;
  private connectedUsers: Map<string, SocketUser> = new Map();

  initialize(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    this.io.on('connection', (socket) => {
      console.log('👤 User connected:', socket.id);

      // משתמש מתחבר
      socket.on('user_join', (userData: { id: number; username: string }) => {
        this.connectedUsers.set(socket.id, {
          ...userData,
          socketId: socket.id
        });
        
        // הודע לכולם על משתמש חדש
        socket.broadcast.emit('user_online', userData);
      });

      // פוסט חדש נוצר
      socket.on('new_post_created', (postData) => {
        console.log('📝 New post created:', postData.title);
        // שלח לכל המשתמשים המחוברים
        this.io?.emit('post_created', postData);
      });

      // עדכון פוסט
      socket.on('post_updated', (postData) => {
        console.log('✏️ Post updated:', postData.id);
        this.io?.emit('post_updated', postData);
      });

      // לייק נוסף לפוסט
      socket.on('post_liked', (data: { postId: number; userId: number; isLiked: boolean; newCount: number }) => {
        console.log('❤️ Post liked:', data.postId);
        this.io?.emit('post_like_updated', data);
      });

      // תגובה חדשה
      socket.on('comment_added', (data: { postId: number; comment: any }) => {
        console.log('💬 Comment added to post:', data.postId);
        this.io?.emit('comment_added', data);
      });

      // עדכון פרופיל משתמש
      socket.on('profile_updated', (userData) => {
        console.log('👤 Profile updated:', userData.username);
        this.io?.emit('profile_updated', userData);
      });

      // הודעה טיפוסית
      socket.on('typing_start', (data: { postId: number; username: string }) => {
        socket.broadcast.emit('user_typing', data);
      });

      socket.on('typing_stop', (data: { postId: number; username: string }) => {
        socket.broadcast.emit('user_stop_typing', data);
      });

      // משתמש מתנתק
      socket.on('disconnect', () => {
        const user = this.connectedUsers.get(socket.id);
        if (user) {
          console.log('👋 User disconnected:', user.username);
          this.connectedUsers.delete(socket.id);
          socket.broadcast.emit('user_offline', user);
        }
      });
    });
  }

  // פונקציות עזר לשליחת עדכונים
  emitToAll(event: string, data: any) {
    this.io?.emit(event, data);
  }

  emitToUser(userId: number, event: string, data: any) {
    // מצא את הסוקט של המשתמש הספציפי
    for (const [socketId, user] of this.connectedUsers.entries()) {
      if (user.id === userId) {
        this.io?.to(socketId).emit(event, data);
        break;
      }
    }
  }

  getConnectedUsers(): SocketUser[] {
    return Array.from(this.connectedUsers.values());
  }
}

// יצירת instance יחיד
export const socketManager = new SocketManager();

