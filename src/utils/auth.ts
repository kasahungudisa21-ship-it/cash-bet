export interface UserProfile {
  id: string;
  username: string;
  phone: string;
  email?: string;
  balance: number;
  bonus: number;
  vipLevel: string;
  createdAt: string;
  verified: boolean;
}

const STORAGE_USERS_KEY = 'cashbet_registered_users';
const STORAGE_CURRENT_USER_KEY = 'cashbet_active_user';

export const getStoredUsers = (): Record<string, { profile: UserProfile; passwordHash: string }> => {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const getCurrentUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const saveCurrentUser = (user: UserProfile | null) => {
  if (!user) {
    localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
  } else {
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
    // Also update in all users
    const users = getStoredUsers();
    if (users[user.phone]) {
      users[user.phone].profile = user;
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    }
  }
};

export const signUpUser = async (phone: string, username: string, password: string): Promise<UserProfile> => {
  const cleanPhone = phone.trim().replace(/\s+/g, '');
  if (!cleanPhone || cleanPhone.length < 9) {
    throw new Error('እባክዎ ትክክለኛ ስልክ ቁጥር ያስገቡ (e.g. 0912345678)');
  }
  if (!username.trim()) {
    throw new Error('እባክዎ የተጠቃሚ ስም (Username) ያስገቡ');
  }
  if (!password || password.length < 4) {
    throw new Error('የይለፍ ቃል ቢያንስ 4 ፊደላት/ቁጥሮች መሆን አለበት');
  }

  const users = getStoredUsers();
  if (users[cleanPhone]) {
    throw new Error('ይህ ስልክ ቁጥር አስቀድሞ ተመዝግቧል! እባክዎ ይግቡ (Sign In)');
  }

  const newUser: UserProfile = {
    id: 'usr-' + Date.now().toString(36),
    username: username.trim(),
    phone: cleanPhone,
    balance: 2500, // Initial balance
    bonus: 100, // 100 ETB Free Bet credit!
    vipLevel: 'Silver VIP',
    createdAt: new Date().toLocaleDateString(),
    verified: true,
  };

  users[cleanPhone] = {
    profile: newUser,
    passwordHash: password, // client-side local verification
  };

  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  saveCurrentUser(newUser);
  return newUser;
};

export const signInUser = async (phoneOrUsername: string, password: string): Promise<UserProfile> => {
  const clean = phoneOrUsername.trim().replace(/\s+/g, '');
  const users = getStoredUsers();

  const entry = Object.values(users).find(
    (u) => u.profile.phone === clean || u.profile.username.toLowerCase() === clean.toLowerCase()
  );

  if (!entry) {
    throw new Error('ተጠቃሚው አልተገኘም! እባክዎ መጀመሪያ ይመዝገቡ (Sign Up)');
  }

  if (entry.passwordHash !== password) {
    throw new Error('የተሳሳተ የይለፍ ቃል! እባክዎ እንደገና ይሞክሩ');
  }

  saveCurrentUser(entry.profile);
  return entry.profile;
};

export const signOutUser = () => {
  saveCurrentUser(null);
};
