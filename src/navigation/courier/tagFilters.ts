type SoloState = {
  hiddenTags: string[];
  isUntaggedHidden: boolean;
};

/**
 * The tag filtering a long-press on `name` should leave behind: that tag alone,
 * with every other tag and the untagged tasks hidden — unless it is already
 * soloed, in which case the long-press lifts the solo and hides nothing.
 *
 * The untagged rule counts towards "already soloed", so a day carrying a single
 * tag still has a state to toggle between.
 */
export function soloTagState(
  tagNames: string[],
  hiddenTagNames: string[],
  isUntaggedHidden: boolean,
  name: string,
): SoloState {
  const isSoloed =
    isUntaggedHidden &&
    tagNames.every(tagName =>
      tagName === name
        ? !hiddenTagNames.includes(tagName)
        : hiddenTagNames.includes(tagName),
    );

  if (isSoloed) {
    return { hiddenTags: [], isUntaggedHidden: false };
  }

  return {
    hiddenTags: tagNames.filter(tagName => tagName !== name),
    isUntaggedHidden: true,
  };
}
