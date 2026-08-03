export interface WaitlistSubmissionResult {
  success: boolean;
  message?: string;
  provider: 'netlify';
}

/**
 * Pure Native Netlify Forms Waitlist Service
 * No Supabase, No serverless functions, No external backend dependencies.
 */
export class WaitlistService {
  /**
   * Submits email directly to native Netlify Forms via standard URLSearchParams POST
   */
  public static async submitEmail(emailInput: string): Promise<WaitlistSubmissionResult> {
    const cleanEmail = emailInput.trim().toLowerCase();

    // 1. Required Email Check
    if (!cleanEmail) {
      return { success: false, message: 'Please enter your email address.', provider: 'netlify' };
    }

    // 2. Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { success: false, message: 'Please enter a valid email address.', provider: 'netlify' };
    }

    // 3. Post to Netlify Forms endpoint
    try {
      const formData = new URLSearchParams();
      formData.append('form-name', 'waitlist');
      formData.append('email', cleanEmail);

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      });

      if (response.ok || response.status === 200 || response.status === 302) {
        return {
          success: true,
          message: "✅ You're on the waitlist! We'll notify you when KONTAGI launches.",
          provider: 'netlify'
        };
      } else {
        return {
          success: false,
          message: 'Unable to submit to Netlify Forms. Please try again.',
          provider: 'netlify'
        };
      }
    } catch (err) {
      console.error('Netlify Forms submission error:', err);
      return {
        success: false,
        message: 'Network connection issue. Please try again.',
        provider: 'netlify'
      };
    }
  }
}
