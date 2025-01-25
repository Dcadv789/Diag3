export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      question_groups: {
        Row: {
          id: number
          name: string
          order: number
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          order: number
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          order?: number
          created_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          group_id: number
          number: string
          text: string
          points: number
          score_type: string
          created_at: string
        }
        Insert: {
          id?: string
          group_id: number
          number: string
          text: string
          points: number
          score_type: string
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: number
          number?: string
          text?: string
          points?: number
          score_type?: string
          created_at?: string
        }
      }
    }
  }
}