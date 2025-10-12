import express, { type Response, type NextFunction, type Router as ExpressRouter } from 'express';
import { randomUUID } from 'node:crypto';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router: ExpressRouter = express.Router();

router.use(authenticate);

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const conversations: Map<string, Message[]> = new Map();

router.post('/chat', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { message, conversationId } = req.body;
    
    if (!message) {
      throw new AppError(400, 'Message is required');
    }
    
    const convId = conversationId || randomUUID();
    const conversation = conversations.get(convId) || [];
    
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    conversation.push(userMessage);
    
    // Simulate AI response (in production, call Ollama)
    const aiResponse: Message = {
      role: 'assistant',
      content: `I'm your private AI assistant running on your Black Box. You said: "${message}". This is a demo response. In production, I would use Ollama to generate intelligent responses based on your personal data, all processed locally without sending anything to the cloud.`,
      timestamp: new Date().toISOString(),
    };
    conversation.push(aiResponse);
    
    conversations.set(convId, conversation);
    
    res.json({
      conversationId: convId,
      response: aiResponse.content,
      history: conversation,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/conversations', (req: AuthRequest, res: Response) => {
  const userConversations = Array.from(conversations.entries()).map(([id, messages]) => ({
    id,
    messageCount: messages.length,
    lastMessage: messages[messages.length - 1],
  }));
  
  res.json({ conversations: userConversations });
});

router.get('/conversations/:id', (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const conversation = conversations.get(req.params.id);
    
    if (!conversation) {
      throw new AppError(404, 'Conversation not found');
    }
    
    res.json({ conversationId: req.params.id, messages: conversation });
  } catch (error) {
    next(error);
  }
});

export default router;
