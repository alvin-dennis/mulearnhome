/**
 * Every backend endpoint path, grouped by domain section. One file — nothing outside this
 * object hardcodes a path string. A feature's `api/<feature>.api.ts` imports this and reads
 * e.g. `endpoints.donation.order`.
 */
export const endpoints = {
  // ============================================
  // Donation Endpoints
  // ============================================
  donation: {
    /** POST - Create one-time payment order */
    order: "/donate/order/",
    /** POST - Verify one-time payment */
    verify: "/donate/verify/",
    /** POST - Create recurring subscription */
    subscription: "/donate/subscription/create/",
    /** POST - Verify subscription payment */
    subscriptionVerify: "/donate/subscription/verify/",
    /** POST - Submit a bank-transfer donation */
    bankTransfer: "/donate/bank-transfer/",
  },

  // ============================================
  // Public Events Endpoints
  // ============================================
  publicEvents: {
    /** GET - List public events */
    getEvents: "/public/events/",
  },

  // ============================================
  // Weekly Twitches (recurring media-content sessions) Endpoints
  // ============================================
  weeklyTwitches: {
    /** GET - Office Hours sessions */
    officeHours: "/dashboard/media-content/office-hours/",
    /** GET - Salt Mango Tree episodes */
    saltMangoTree: "/dashboard/media-content/salt-mango-tree/",
    /** GET - Inspiration Station episodes */
    inspirationStation: "/dashboard/media-content/inspiration-station/",
    /** GET - Grab Your Superpowers sessions */
    grabYourSuperpowers: "/dashboard/media-content/grab-your-superpowers/",
  },

  // ============================================
  // Career Lab Endpoints
  // ============================================
  careerLab: {
    /** GET - Ongoing hiring listings (paginated) */
    ongoing: "/public/career-lab/ongoing/",
    /** GET - Previous hiring listings (paginated) */
    previous: "/public/career-lab/previous/",
  },

  // ============================================
  // Profile / Stats Endpoints (shared — no dedicated feature owns these)
  // ============================================
  profile: {
    /** GET - Top learners leaderboard */
    topLearners: "/leaderboard/students/",
    /** GET - Authenticated user profile (private gateway) */
    userProfile: "/dashboard/profile/user-profile/",
    /** GET - Public profile image by muid, path segment appended by caller */
    profilePic: "/public/profile-pic/",
  },
} as const;
