import { supabase } from '@/lib/supabase'

export interface Task {
  id: string
  user_id: string
  task_date: string
  title: string
  completed: boolean
  if_then_plan?: string
  xp_awarded: number
  created_at: string
  updated_at: string
}

export async function createTask(
  title: string,
  ifThenPlan?: string
): Promise<Task | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          user_id: user.id,
          task_date: new Date().toISOString().split('T')[0],
          title,
          if_then_plan: ifThenPlan,
          xp_awarded: 10,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating task:', error)
    return null
  }
}

export async function getTasksForToday(): Promise<Task[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .eq('task_date', today)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return []
  }
}

export async function completeTask(taskId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: true })
      .eq('id', taskId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error completing task:', error)
    return false
  }
}

export async function deleteTask(taskId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting task:', error)
    return false
  }
}
