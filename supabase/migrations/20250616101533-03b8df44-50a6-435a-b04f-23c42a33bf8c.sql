
-- Create a table for public messages
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Since this is a public message board, we'll allow anyone to read and insert messages
-- No authentication required
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view all messages
CREATE POLICY "Anyone can view messages" 
  ON public.messages 
  FOR SELECT 
  USING (true);

-- Allow anyone to insert messages
CREATE POLICY "Anyone can create messages" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (true);
