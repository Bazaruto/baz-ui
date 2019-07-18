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
describe('SuggestionHelper', () => {
  beforeEach(() => {
    helper = new SuggestionHelper({source: getData, fieldToMatch: 'name'});
  });

  describe('#getSuggestions', () => {
    it('finds simple matches', async () => {
      const results = await helper.getSuggestions(' aru ');
      assert.deepEqual(
        results,
        [
          {id: 224, name: 'Arusha Game Lodge'},
          {id: 34, name: 'Arusha Safari Camp'},
        ]
      );
    });

    it('finds matches across words', async () => {
      const results = await helper.getSuggestions(' aru  lodg ');
      assert.deepEqual(
        results,
        [
          {id: 224, name: 'Arusha Game Lodge'},
        ]
      );
    });

    it('returns empty array when nothing is found', async () => {
      const results = await helper.getSuggestions('motel');
      assert.deepEqual(
        results,
        []
      );
    });

    it('allows overriding search options', async () => {
      const results = await helper.getSuggestions(' 34 ', {fieldToMatch: 'id'});
      assert.deepEqual(
        results,
        [
          {id: 34, name: 'Arusha Safari Camp'},
          {id: 134, name: 'Table Bay Hotel'},
        ]
      );
    });
  });

  describe('#getSuggestion', () => {
    it('finds by id', async () => {
      const result = await helper.getSuggestion(224);
      assert.deepEqual(
        result,
        {id: 224, name: 'Arusha Game Lodge'},
      );
    });

    it('returns nothing when not found', async () => {
      const result = await helper.getSuggestion(223);
      assert.deepEqual(
        result,
        null
      );
    });
  });
});
