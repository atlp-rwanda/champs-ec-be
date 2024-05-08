export const isValidDate = (dateString: string): boolean => {
  // Regular expression to match common date formats (YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY, etc.)
  const DATE_REGEX =
    /^(?:(?:(?:0?[1-9]|1[0-2])\/(?:0?[1-9]|1\d|2[0-8])|(?:0?[13-9]|1[0-2])\/(?:29|30)|(?:0?[13578]|1[02])\/31)\/(?:19|20)\d{2}|0?2\/29\/(?:19|20)(?:[02468][048]|[13579][26]))$|^(?:19|20)\d{2}-(?:(?:0?[1-9]|1[0-2])-(?:0?[1-9]|1\d|2[0-8])|(?:0?[13-9]|1[0-2])-(?:29|30)|(?:0?[13578]|1[02])-31)$/;

  return DATE_REGEX.test(dateString);
};
