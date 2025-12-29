
import { supabase } from '../lib/supabase';

/**
 * Uploads audio blob to Supabase Storage, then triggers an Edge Function
 * to Transcribe it using Google Cloud Speech-to-Text.
 */
export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    // 1. Upload the file to a temp bucket
    const filename = `audio-${Date.now()}.webm`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('voice-memos')
      .upload(filename, audioBlob);

    if (uploadError) throw uploadError;

    // 2. Call Edge Function (The Backend)
    // You will create a function called 'transcribe' in Supabase
    const { data, error } = await supabase.functions.invoke('transcribe', {
      body: { path: uploadData.path }
    });

    if (error) throw error;
    return data.transcript;

  } catch (error) {
    console.error('Transcription failed:', error);
    return "Error transcribing audio.";
  }
};

/**
 * Sends journal text to Supabase Edge Function which calls OpenAI (GPT-4o-mini).
 */
export const analyzeEntry = async (text: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-entry', {
      body: { content: text }
    });

    if (error) throw error;
    return data; // Returns { sentiment, tags, insight }

  } catch (error) {
    console.error('Analysis failed:', error);
    return null;
  }
};
