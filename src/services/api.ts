
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/lib/types";

export async function fetchMessages(): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }

  return data || [];
}

export async function sendMessage(text: string): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .insert([{ text }]);

  if (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}
