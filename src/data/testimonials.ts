export interface Testimonial {
  name: string
  role: string
  company: string
  quote: string
  rating: number
  date: string
  location: string
}

export const testimonials: Testimonial[] = [
  {
    name: 'Maya Alston',
    role: 'Design Lead',
    company: 'Northstar Health',
    quote:
      "Domani is the first planner that respects how my brain actually works. Planning at 9pm means I stop doom-scrolling and start sleeping because tomorrow already feels handled.",
    rating: 5,
    date: '2024-12-18',
    location: 'Austin, TX',
  },
  {
    name: 'Victor Martinez',
    role: 'Startup COO',
    company: 'Relayline',
    quote:
      'We swapped Sunsama for Domani and the team immediately stopped rewriting their to-do lists every morning. The plan lock feature alone is worth the switch.',
    rating: 4.8,
    date: '2024-11-02',
    location: 'New York, NY',
  },
  {
    name: 'Ananya Desai',
    role: 'Product Manager',
    company: 'Lattice Labs',
    quote:
      'Setting the next day’s MITs at night means I hit deep work by 7:30am. Decision fatigue used to stall me for an hour—now it’s gone.',
    rating: 4.9,
    date: '2024-12-05',
    location: 'San Francisco, CA',
  },
  {
    name: 'Chris Bennett',
    role: 'Head of Revenue',
    company: 'ClarityOps',
    quote:
      'The streak tracker and health slots keep me honest. Domani feels opinionated in the best way—like a coach who already knows my priorities.',
    rating: 5,
    date: '2025-01-03',
    location: 'Denver, CO',
  },
]

export const averageRating = testimonials.reduce((sum, item) => sum + item.rating, 0) / testimonials.length
