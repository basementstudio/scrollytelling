export type Experiment = {
  filename: string
  title: string
  href: string
  tags: string[]
  number: number
  og: string | null
  contributors: Array<{
    id: string
    url: string
    name: string
    avatarUrl: string
    email: string
    company: string
  }>
}