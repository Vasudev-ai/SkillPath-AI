export type NsqfCourse = {
  course_id: string;
  title: string;
  nsqf_level: number | string;
  provider: string;
  duration_weeks: number;
  cost_inr: number;
  url: string;
};

export const nsqfCourses: NsqfCourse[] = [
  {
    course_id: 'NSQF001',
    title: 'Full-Stack Web Development',
    nsqf_level: 5,
    provider: 'Skill India Digital',
    duration_weeks: 24,
    cost_inr: 50000,
    url: 'https://www.skillindiadigital.gov.in/',
  },
  {
    course_id: 'NSQF002',
    title: 'Data Analytics Foundation',
    nsqf_level: 4,
    provider: 'NCVET',
    duration_weeks: 16,
    cost_inr: 35000,
    url: 'https://ncvet.gov.in/',
  },
  {
    course_id: 'NSQF003',
    title: 'Cloud Computing Practitioner',
    nsqf_level: 6,
    provider: 'AWS Academy',
    duration_weeks: 12,
    cost_inr: 45000,
    url: 'https://aws.amazon.com/training/awsacademy/',
  },
  {
    course_id: 'NSQF004',
    title: 'Digital Marketing Specialist',
    nsqf_level: 5,
    provider: 'Google Career Certificates',
    duration_weeks: 20,
    cost_inr: 25000,
    url: 'https://grow.google/intl/en_in/certificates/',
  },
  {
    course_id: 'NSQF005',
    title: 'Advanced AI and Machine Learning',
    nsqf_level: 7,
    provider: 'IIT Madras',
    duration_weeks: 36,
    cost_inr: 120000,
    url: 'https://www.iitm.ac.in/',
  },
  {
    course_id: 'NSQF006',
    title: 'Cybersecurity Analyst',
    nsqf_level: 6,
    provider: 'C-DAC',
    duration_weeks: 24,
    cost_inr: 60000,
    url: 'https://www.cdac.in/',
  },
];
