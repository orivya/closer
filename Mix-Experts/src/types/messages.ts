export type InquiryStatus = 'new' | 'read' | 'replied' | 'converted' | 'archived';

export type MessageTemplateCategory = 'inquiry_response' | 'follow_up' | 'status_update' | 'general' | 'custom';

export interface Message {
  id: string;
  thread_id: string;
  sender_id: string | null;
  recipient_id: string;
  sender_email: string | null;
  sender_name: string | null;
  subject: string | null;
  content: string;
  attachments: string[] | null;
  order_id: string | null;
  is_inquiry: boolean;
  inquiry_service_id: string | null;
  inquiry_status: InquiryStatus | null;
  is_read: boolean;
  read_at: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface MessageWithProfile extends Message {
  sender_profile?: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
  recipient_profile?: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

export interface ThreadSummary {
  thread_id: string;
  recipient_id: string;
  sender_id: string | null;
  sender_email: string | null;
  sender_name: string | null;
  subject: string | null;
  is_inquiry: boolean;
  inquiry_status: InquiryStatus | null;
  order_id: string | null;
  latest_message: string;
  latest_message_at: string;
  unread_count: number;
  message_count: number;
  sender_username: string | null;
  sender_display_name: string | null;
  sender_avatar_url: string | null;
  thread_started_at: string;
}

export interface MessageTemplate {
  id: string;
  profile_id: string;
  name: string;
  subject: string | null;
  body: string;
  category: MessageTemplateCategory | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface SendMessageRequest {
  thread_id: string;
  recipient_id: string;
  content: string;
  subject?: string;
  attachments?: string[];
  order_id?: string;
}

export interface SendInquiryRequest {
  recipient_id: string;
  sender_name: string;
  sender_email: string;
  subject: string;
  message: string;
  service_id?: string;
}

export interface CreateTemplateRequest {
  name: string;
  subject?: string;
  body: string;
  category?: MessageTemplateCategory;
}

export interface UpdateTemplateRequest {
  name?: string;
  subject?: string;
  body?: string;
  category?: MessageTemplateCategory;
  is_active?: boolean;
  display_order?: number;
}
