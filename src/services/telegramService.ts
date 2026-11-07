export interface TelegramBotInfo {
  id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
  can_join_groups: boolean;
  can_read_all_group_messages: boolean;
  supports_inline_queries: boolean;
}

export interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username?: string;
    };
    chat: {
      id: number;
      first_name: string;
      username?: string;
      type: string;
    };
    date: number;
    text?: string;
  };
  callback_query?: {
    id: string;
    from: {
      id: number;
      first_name: string;
      username?: string;
    };
    message?: {
      message_id: number;
      chat: {
        id: number;
      };
    };
    data?: string;
  };
}

export const USER_BOT_TOKEN = '9166895702:AAEmgZH9Tk0OfHgeEg44iF-P3M98UYiFSCo';
export const USER_BOT_USERNAME = 'Seedhemout_coder_bot';
export const USER_BOT_NAME = 'Seedhemout coder';

export async function fetchBotMe(token: string): Promise<{ ok: boolean; result?: TelegramBotInfo; description?: string }> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    return await res.json();
  } catch (err: any) {
    return { ok: false, description: err.message || 'Network error' };
  }
}

export async function fetchUpdates(token: string, offset?: number): Promise<{ ok: boolean; result?: TelegramUpdate[]; description?: string }> {
  try {
    const url = offset 
      ? `https://api.telegram.org/bot${token}/getUpdates?offset=${offset}&timeout=5`
      : `https://api.telegram.org/bot${token}/getUpdates?timeout=5`;
    const res = await fetch(url);
    return await res.json();
  } catch (err: any) {
    return { ok: false, description: err.message };
  }
}

export async function sendTelegramMessage(
  token: string, 
  chatId: number | string, 
  text: string, 
  inlineKeyboard?: Array<Array<{ text: string; callback_data?: string; url?: string }>>
) {
  try {
    const body: any = {
      chat_id: chatId,
      text,
      parse_mode: 'HTML'
    };
    if (inlineKeyboard && inlineKeyboard.length > 0) {
      body.reply_markup = {
        inline_keyboard: inlineKeyboard
      };
    }

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (err: any) {
    return { ok: false, description: err.message };
  }
}

export async function answerCallback(token: string, callbackQueryId: string, text?: string) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text: text || 'Processing...'
      })
    });
    return await res.json();
  } catch (err: any) {
    return { ok: false, description: err.message };
  }
}

export async function createRealInviteLink(
  token: string, 
  channelId: string, 
  options: { memberLimit?: number; expireHours?: number; name?: string } = {}
) {
  try {
    const body: any = {
      chat_id: channelId.trim(),
      member_limit: options.memberLimit ?? 1,
      name: options.name || 'Student_One_Time_Invite'
    };
    if (options.expireHours) {
      body.expire_date = Math.floor(Date.now() / 1000) + (options.expireHours * 3600);
    }

    const res = await fetch(`https://api.telegram.org/bot${token}/createChatInviteLink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (err: any) {
    return { ok: false, description: err.message };
  }
}
