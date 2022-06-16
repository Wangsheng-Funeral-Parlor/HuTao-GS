export interface AnnouncementType {
  id: number
  mi18nName: string
  name: string
}

export interface Announcement {
  type: number
  subtitle: string
  title: string
  banner: string
  content: string
  start: number
  end: number
  tag: number
  loginAlert: boolean
}