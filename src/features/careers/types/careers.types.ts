export interface PaginationMeta {
  count: number;
  totalPages: number;
  isNext: boolean;
  isPrev: boolean;
  nextPage: number | null;
  prevPage: number | null;
  current_page: number;
}

export interface OngoingHiring {
  id: string;
  posted_date: string;
  role: string;
  organization: string;
  title: string;
  location: string;
  lastdate: string;
  applylink: string;
  jdlink: string;
  duration: string;
  remuneration: string;
  vacancies: number;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
}

export interface PreviousHiring {
  id: string;
  role: string;
  organization: string;
  title: string;
  location: string;
  lastdate: string;
  remuneration: string;
  vacancies: number;
  duration: string;
  extracontent?: string;
}

export interface CareersCardProps {
  id?: string;
  role?: string;
  organization?: string;
  title?: string;
  location?: string;
  lastdate?: string;
  remuneration?: string;
  vacancies?: number;
  duration?: string;
  applylink?: string;
  jdlink?: string;
  posted_date?: string;
}

export interface ClosedCareersCardProps {
  id?: string;
  title?: string;
  role?: string;
  organization?: string;
  location?: string;
  lastdate?: string;
  remuneration?: string;
  vacancies?: number;
  duration?: string;
  extracontent?: string;
}

export interface Company {
  alt: string;
  src: string;
}
