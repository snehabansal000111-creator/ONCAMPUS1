import { createClient } from "@/lib/supabase/server";

export interface ChatMessage {
  id: string;
  user_id: string;
  question: string;
  answer: string;
  detected_topic: string | null;
  topics: string[];
  timestamp: string;
  created_at: string;
}

/**
 * Detects topics from a question using simple keyword matching.
 * Used to categorize conversations for better context retrieval.
 */
function detectTopics(question: string): string[] {
  const topics: string[] = [];
  const lowerQuestion = question.toLowerCase();

  // Topic keywords mapping
  const topicKeywords: { [key: string]: string[] } = {
    "HTML": ["html", "element", "tag", "markup", "semantic"],
    "CSS": ["css", "style", "layout", "responsive", "flexbox", "grid"],
    "JavaScript": ["javascript", "js", "variable", "function", "async", "promise", "callback"],
    "React": ["react", "component", "hooks", "useState", "useeffect", "jsx"],
    "Node.js": ["node", "nodejs", "express", "backend", "server", "api"],
    "Database": ["database", "sql", "postgres", "mongodb", "query", "schema"],
    "Git": ["git", "github", "commit", "push", "repository", "branch"],
    "Career": ["career", "job", "interview", "portfolio", "resume", "placement"],
    "Python": ["python", "django", "flask", "data", "machine learning"],
    "TypeScript": ["typescript", "ts", "type", "interface", "generic"],
    "Testing": ["test", "jest", "mocha", "unit test", "integration test"],
    "DevOps": ["docker", "kubernetes", "ci/cd", "deployment", "devops"],
    "Problem Solving": ["algorithm", "data structure", "leetcode", "dsa", "problem"],
  };

  // Match keywords
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(keyword => lowerQuestion.includes(keyword))) {
      topics.push(topic);
    }
  }

  return topics.length > 0 ? topics : ["General"];
}

/**
 * Saves a chat message to history.
 * Called after Claude responds to store the conversation.
 */
export async function saveChatMessage(
  userId: string,
  question: string,
  answer: string,
  detectedTopic?: string
): Promise<ChatMessage> {
  if (!userId || !question || !answer) {
    throw new Error("User ID, question, and answer are required");
  }

  try {
    const supabase = await createClient();

    // Auto-detect topics if not provided
    const topics = detectTopics(question);
    const primaryTopic = detectedTopic || topics[0] || "General";

    const { data, error } = await supabase
      .from("chat_history")
      .insert({
        user_id: userId,
        question: question.trim(),
        answer: answer.trim(),
        detected_topic: primaryTopic,
        topics,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save chat message: ${error.message}`);
    }

    if (!data) {
      throw new Error("Failed to save chat message");
    }

    return {
      id: data.id,
      user_id: data.user_id,
      question: data.question,
      answer: data.answer,
      detected_topic: data.detected_topic,
      topics: data.topics || [],
      timestamp: data.timestamp,
      created_at: data.created_at,
    };
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error saving chat message");
  }
}

/**
 * Retrieves the last N chat messages for a user.
 * Used to provide conversation context to Claude.
 */
export async function getRecentChatHistory(
  userId: string,
  limit: number = 5
): Promise<ChatMessage[]> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("chat_history")
      .select("*")
      .eq("user_id", userId)
      .order("timestamp", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch chat history: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    return data
      .reverse() // Reverse to get chronological order (oldest first)
      .map((msg) => ({
        id: msg.id,
        user_id: msg.user_id,
        question: msg.question,
        answer: msg.answer,
        detected_topic: msg.detected_topic,
        topics: msg.topics || [],
        timestamp: msg.timestamp,
        created_at: msg.created_at,
      }));
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error fetching chat history");
  }
}

/**
 * Retrieves chat history filtered by topic.
 * Useful for finding relevant past discussions about specific topics.
 */
export async function getChatHistoryByTopic(
  userId: string,
  topic: string,
  limit: number = 5
): Promise<ChatMessage[]> {
  if (!userId || !topic) {
    throw new Error("User ID and topic are required");
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("chat_history")
      .select("*")
      .eq("user_id", userId)
      .or(`detected_topic.eq.${topic},topics.cs.{${topic}}`)
      .order("timestamp", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch chat history by topic: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    return data
      .reverse()
      .map((msg) => ({
        id: msg.id,
        user_id: msg.user_id,
        question: msg.question,
        answer: msg.answer,
        detected_topic: msg.detected_topic,
        topics: msg.topics || [],
        timestamp: msg.timestamp,
        created_at: msg.created_at,
      }));
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error fetching chat history by topic");
  }
}

/**
 * Gets all unique topics the user has discussed.
 * Useful for understanding user's learning journey.
 */
export async function getUserTopics(userId: string): Promise<string[]> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("chat_history")
      .select("detected_topic, topics")
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to fetch user topics: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    // Collect all unique topics
    const topicSet = new Set<string>();
    data.forEach((msg) => {
      if (msg.detected_topic) {
        topicSet.add(msg.detected_topic);
      }
      if (msg.topics && Array.isArray(msg.topics)) {
        msg.topics.forEach((t) => topicSet.add(t));
      }
    });

    return Array.from(topicSet).sort();
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error fetching user topics");
  }
}

/**
 * Formats chat history for inclusion in Claude's system prompt.
 * Makes conversation history readable and contextual.
 */
export function formatChatHistoryForPrompt(history: ChatMessage[]): string {
  if (history.length === 0) {
    return "No previous conversations yet.";
  }

  const formatted = history
    .map((msg, index) => {
      const date = new Date(msg.timestamp).toLocaleDateString();
      return `
Conversation ${index + 1} (${date}) - Topic: ${msg.detected_topic || "General"}
Q: ${msg.question}
A: ${msg.answer.substring(0, 200)}${msg.answer.length > 200 ? "..." : ""}`;
    })
    .join("\n");

  return `## Recent Conversation History (${history.length} past discussions)
${formatted}`;
}

/**
 * Searches chat history for specific keywords.
 * Helps find relevant past discussions.
 */
export async function searchChatHistory(
  userId: string,
  keyword: string,
  limit: number = 5
): Promise<ChatMessage[]> {
  if (!userId || !keyword) {
    throw new Error("User ID and keyword are required");
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("chat_history")
      .select("*")
      .eq("user_id", userId)
      .or(
        `question.ilike.%${keyword}%,answer.ilike.%${keyword}%,detected_topic.ilike.%${keyword}%`
      )
      .order("timestamp", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to search chat history: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    return data
      .reverse()
      .map((msg) => ({
        id: msg.id,
        user_id: msg.user_id,
        question: msg.question,
        answer: msg.answer,
        detected_topic: msg.detected_topic,
        topics: msg.topics || [],
        timestamp: msg.timestamp,
        created_at: msg.created_at,
      }));
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error searching chat history");
  }
}

/**
 * Gets statistics about user's conversation history.
 */
export async function getChatHistoryStats(userId: string): Promise<{
  total_conversations: number;
  unique_topics: number;
  topics: string[];
  first_conversation: string | null;
  last_conversation: string | null;
}> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("chat_history")
      .select("detected_topic, topics, timestamp")
      .eq("user_id", userId)
      .order("timestamp", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch chat history stats: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return {
        total_conversations: 0,
        unique_topics: 0,
        topics: [],
        first_conversation: null,
        last_conversation: null,
      };
    }

    // Collect unique topics
    const topicSet = new Set<string>();
    data.forEach((msg) => {
      if (msg.detected_topic) {
        topicSet.add(msg.detected_topic);
      }
      if (msg.topics && Array.isArray(msg.topics)) {
        msg.topics.forEach((t) => topicSet.add(t));
      }
    });

    const topics = Array.from(topicSet).sort();
    const timestamps = data.map((msg) => msg.timestamp).filter(Boolean);

    return {
      total_conversations: data.length,
      unique_topics: topics.length,
      topics,
      last_conversation: timestamps[0] || null,
      first_conversation: timestamps[timestamps.length - 1] || null,
    };
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error fetching chat history stats");
  }
}
