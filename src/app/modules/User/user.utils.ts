import prisma from "../../utils/prisma";


//*utility function for get current year last two digit
const getCurrentYearLastTwoDigits = () => {
  // Get the current year
  const currentYear = new Date().getFullYear();

  // Extract the last two digits
  const lastTwoDigits = currentYear % 100;

  return lastTwoDigits;
};


//* Utility function to generate a random suffix
const generateRandomSuffix = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
const lastTwoDigit = getCurrentYearLastTwoDigits()
  return `${result}${lastTwoDigit}`;
};
/*
 * Generate a unique username with a suffix to make it unique.
 * If the derived name with the suffix already exists, generate a new suffix.
 */
async function generateUniqueUserNameWithSuffix(baseName: string): Promise<string> {
  let uniqueName = baseName;
  const suffix = generateRandomSuffix(5); // Generate a random suffix
  
  // Append the suffix to the base name
  uniqueName += `${suffix}`;

  // Check if the username with the suffix already exists
  if (await prisma.user.findFirst({ where : {userName :uniqueName} })) {
    // If it exists, recursively generate a new suffix
    return generateUniqueUserNameWithSuffix(baseName);
  }
  
  return uniqueName;
}

/*
 * Generate a unique username based on the provided payload.
 * If the provided username or its derived name from the email already exists,
 * add a unique suffix to make it unique.
 */
export async function generateUniqueUserName(payload: { userName?: string; email: string }): Promise<string> {
  const baseName = ((payload.userName ? payload.userName : payload.email.split('@')[0]) || '').replace(/\s+/g, '').toLowerCase();

  // Check if the base name already exists
  let userName = baseName;

  if (await prisma.user.findFirst({ where : {name :userName} })) {
    userName = await generateUniqueUserNameWithSuffix(baseName);
  }

  return userName;
}

// //* Admin ID
// export const findLastAdminId = async () => {
//   const lastAdmin = await User.findOne(
//     {
//       role: "admin",
//     },
//     {
//       id: 1,
//       _id: 0,
//     }
//   )
//     .sort({
//       createdAt: -1,
//     })
//     .lean();

//   return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined;
// };

// export const generateAdminId = async () => {
//   let currentId = (0).toString();
//   const lastAdminId = await findLastAdminId();

//   if (lastAdminId) {
//     currentId = lastAdminId.substring(2);
//   }

//   let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

//   incrementId = `A-${incrementId}`;
//   return incrementId;
// };
