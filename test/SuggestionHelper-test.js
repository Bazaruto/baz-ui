import assert from 'assert';
import SuggestionHelper from '../src/services/SuggestionHelper';

const data = [
  { id: 122, name: 'Cabanas' },
  { id: 224, name: 'Arusha Game Lodge' },
  { id: 34, name: 'Arusha Safari Camp' },
  { id: 134, name: 'Table Bay Hotel' },
];

const getData = () => new Promise(res => res(data));

let helper;
describe('SuggestionHelper#getSuggestions', () => {
  beforeEach(() => {
    helper = new SuggestionHelper({source: getData});
  });

  it('finds simple matches', async () => {
    const results = await helper.getSuggestions(' rush ', { fieldToMatch: 'name' });
    assert.deepEqual(
      results,
      [
        { id: 224, name: 'Arusha Game Lodge' },
        { id: 34, name: 'Arusha Safari Camp' },
      ]
    );
  });

  it('finds matches across words', async () => {
    const results = await helper.getSuggestions(' rush  lodg ', { fieldToMatch: 'name' });
    assert.deepEqual(
      results,
      [
        { id: 224, name: 'Arusha Game Lodge' },
      ]
    );
  });

  it('finds matches across fields', async () => {
    const results = await helper.getSuggestions('34 aru', { getStringToMatch: accomm => `${accomm.id} ${accomm.name}` });
    assert.deepEqual(
      results,
      [
        { id: 34, name: 'Arusha Safari Camp' },
      ]
    );
  });
});