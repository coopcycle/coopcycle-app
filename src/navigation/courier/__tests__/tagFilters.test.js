import { soloTagState } from '../tagFilters';

const TAGS = ['CLIENTS', 'Hope Nursery', 'BIOCOOP'];

describe('soloTagState', () => {
  it('hides every other tag, and the untagged tasks, from a clean state', () => {
    expect(soloTagState(TAGS, [], false, 'CLIENTS')).toEqual({
      hiddenTags: ['Hope Nursery', 'BIOCOOP'],
      isUntaggedHidden: true,
    });
  });

  it('never hides the soloed tag', () => {
    expect(
      soloTagState(TAGS, ['CLIENTS'], false, 'CLIENTS').hiddenTags,
    ).not.toContain('CLIENTS');
  });

  it('shows the soloed tag back when it was hidden', () => {
    expect(soloTagState(TAGS, ['CLIENTS', 'BIOCOOP'], true, 'CLIENTS')).toEqual(
      { hiddenTags: ['Hope Nursery', 'BIOCOOP'], isUntaggedHidden: true },
    );
  });

  it('lifts the solo when the tag is already the only one shown', () => {
    expect(
      soloTagState(TAGS, ['Hope Nursery', 'BIOCOOP'], true, 'CLIENTS'),
    ).toEqual({ hiddenTags: [], isUntaggedHidden: false });
  });

  it('is not soloed yet while the untagged tasks still show', () => {
    expect(
      soloTagState(TAGS, ['Hope Nursery', 'BIOCOOP'], false, 'CLIENTS'),
    ).toEqual({
      hiddenTags: ['Hope Nursery', 'BIOCOOP'],
      isUntaggedHidden: true,
    });
  });

  it('toggles the untagged tasks on a day carrying a single tag', () => {
    expect(soloTagState(['CLIENTS'], [], false, 'CLIENTS')).toEqual({
      hiddenTags: [],
      isUntaggedHidden: true,
    });
    expect(soloTagState(['CLIENTS'], [], true, 'CLIENTS')).toEqual({
      hiddenTags: [],
      isUntaggedHidden: false,
    });
  });
});
