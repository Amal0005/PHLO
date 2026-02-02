/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";
import { creatorStep1Schema, creatorStep2Schema, creatorStep3Schema, creatorStep4Schema } from "./registerCreatorValidationSchema";


export async function validateStep1(
  formData: any,
  checkCreatorExists: (email: string, phone: string) => Promise<void>
): Promise<boolean> {
  const result = creatorStep1Schema.safeParse(formData);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    if (errors.fullName) toast.error(errors.fullName[0]);
    else if (errors.email) toast.error(errors.email[0]);
    else if (errors.phone) toast.error(errors.phone[0]);
    else if (errors.password) toast.error(errors.password[0]);
    else if (errors.confirmPassword) toast.error(errors.confirmPassword[0]);

    return false;
  }
 try {
    await checkCreatorExists(formData.email, formData.phone);
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Validation failed");
    return false;
  }

  return true;

}

export function validateStep2(formData: any): boolean {
  const result = creatorStep2Schema.safeParse(formData);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    
    if (errors.city) {
      toast.error(errors.city[0]);
      return false;
    }
    if (errors.yearsOfExperience) {
      toast.error(errors.yearsOfExperience[0]);
      return false;
    }
    
    return false;
  }

  return true;
}

export function validateStep3(formData: any): boolean {
  const result = creatorStep3Schema.safeParse(formData);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    
    if (errors.bio) {
      toast.error(errors.bio[0]);
      return false;
    }
    if (errors.portfolioLink) {
      toast.error(errors.portfolioLink[0]);
      return false;
    }
    if (errors.specialties) {
      toast.error(errors.specialties[0]);
      return false;
    }
    
    return false;
  }

  return true;
}

export function validateStep4(formData: any): boolean {
  const result = creatorStep4Schema.safeParse(formData);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    
    if (errors.profilePhoto) {
      toast.error(errors.profilePhoto[0]);
      return false;
    }
    if (errors.governmentId) {
      toast.error(errors.governmentId[0]);
      return false;
    }
    
    return false;
  }

  return true;
}