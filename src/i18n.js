import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          home: 'Home',
          services: 'Services',
          bookings: 'Bookings',
          account: 'Account',
          my_profile: 'My Profile',
      settings: 'Settings',
      my_bookings: 'My Bookings',
      payments: 'Payments',
      help: 'Help Center',
      logout: 'Log Out',
      profile: {
        title: 'My Profile',
        name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        change_password: 'Change Password',
        current_password: 'Current Password',
        new_password: 'New Password',
        confirm_password: 'Confirm Password',
        save_changes: 'Save Changes',
        required_field: 'This field is required',
        invalid_email: 'Invalid email address',
        current_password_required: 'Current password is required to change password',
        password_min_length: 'Password must be at least 8 characters',
        passwords_mismatch: 'Passwords do not match',
        fetch_error: 'Failed to load profile data',
        update_error: 'Failed to update profile',
        update_success: 'Profile updated successfully'
      }
        }
      },
      fr: {
        translation: {
          home: 'Accueil',
          services: 'Services',
          bookings: 'Réservations',
          account: 'Compte'
        }
      },
      // Add other languages as needed
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;