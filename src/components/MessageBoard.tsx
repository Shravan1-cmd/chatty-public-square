
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { fetchMessages, sendMessage } from '@/services/api';
import { Message } from '@/lib/types';
import { Send } from 'lucide-react';

const MessageBoard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const fetchedMessages = await fetchMessages();
      setMessages(fetchedMessages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSending(true);
      await sendMessage(newMessage.trim());
      setNewMessage('');
      await loadMessages(); // Refresh messages after sending
      toast({
        title: "Success",
        description: "Message sent successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Public Message Board</h1>
        <p className="text-gray-600">Share your thoughts with everyone!</p>
      </div>

      {/* Message Input Form */}
      <form onSubmit={handleSendMessage} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium text-gray-700">
            Your Message
          </label>
          <Textarea
            id="message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here..."
            className="min-h-[100px]"
            maxLength={500}
          />
          <div className="text-xs text-gray-500 text-right">
            {newMessage.length}/500 characters
          </div>
        </div>
        <Button 
          type="submit" 
          disabled={isSending || !newMessage.trim()}
          className="w-full"
        >
          <Send className="w-4 h-4 mr-2" />
          {isSending ? 'Sending...' : 'Send Message'}
        </Button>
      </form>

      {/* Messages List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No messages yet. Be the first to share something!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-gray-900 mb-2 whitespace-pre-wrap">{message.text}</p>
                <p className="text-xs text-gray-500">
                  {formatDate(message.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <Button 
          variant="outline" 
          onClick={loadMessages}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Refresh Messages'}
        </Button>
      </div>
    </div>
  );
};

export default MessageBoard;
