/**
 * Verifies if passport is valid for at least 6 months after the honeymoon ends.
 */
export function validatePassportExpiry(passportExpiryDate: string, tripEndDate: string): boolean {
  if (!passportExpiryDate || !tripEndDate) return true;
  const passport = new Date(passportExpiryDate);
  const end = new Date(tripEndDate);
  
  const sixMonthsAfterEnd = new Date(end.getTime());
  sixMonthsAfterEnd.setMonth(sixMonthsAfterEnd.getMonth() + 6);
  
  return passport >= sixMonthsAfterEnd;
}

/**
 * Checks destination safety parameter flags against known weather patterns.
 */
export function checkWeatherWarnings(destination: string, startDate: string): { warning: boolean; message: string } {
  if (!destination || !startDate) return { warning: false, message: '' };
  const month = new Date(startDate).getMonth(); // 0 = Jan, 11 = Dec
  const lowerDest = destination.toLowerCase();

  if ((lowerDest.includes('caribbean') || lowerDest.includes('bahamas') || lowerDest.includes('florida')) && (month >= 5 && month <= 10)) {
    return {
      warning: true,
      message: '⚠️ Peak Atlantic Hurricane Season occurs during these travel dates. Consider travel protection policies.'
    };
  }

  if ((lowerDest.includes('thailand') || lowerDest.includes('bali') || lowerDest.includes('india') || lowerDest.includes('monsoon')) && (month >= 4 && month <= 9)) {
    return {
      warning: true,
      message: '⚠️ Your schedule aligns with traditional regional monsoon periods. Expect elevated seasonal rainfall levels.'
    };
  }

  return { warning: false, message: '' };
}
