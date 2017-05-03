import { expect } from 'chai';
import { store } from '../../ds';
import * as Resources from '../../resources'

describe.skip('relations/nested', () => {
  describe('when data are fetched, relations should persist and be assigned if data is there', () => {
    const
      CATEGORY_LENGTH = 4,
      ROOT_CATEGORY = {
        ID: '437add6a-a40f-4cf0-9c27-fd7bb4c9ef71',
        CHILDREN: [
          'dbb8d464-8229-4865-86c3-48ac90ae1029',
          'eecff649-5ad2-4e42-8d1a-f1e5d55926bd'
        ]
      },
      CATEGORIES_ASCENDING_PATH = [
        'c829339e-7b24-4fc8-b6ff-b605a2020fb3',
        'eecff649-5ad2-4e42-8d1a-f1e5d55926bd',
        '437add6a-a40f-4cf0-9c27-fd7bb4c9ef71'
      ],
      CATEGORIES_NAME = {
        "437add6a-a40f-4cf0-9c27-fd7bb4c9ef71": "Level I - Root category",
        "dbb8d464-8229-4865-86c3-48ac90ae1029": "Cat I.A",
        "eecff649-5ad2-4e42-8d1a-f1e5d55926bd": "Cat I.B",
        "c829339e-7b24-4fc8-b6ff-b605a2020fb3": "Cat I.B.a"
      }
    ;

    let categories:Array<any>;

    beforeEach(() => {
      return store.findAll('Category').then((datas:Array<any>) => {
        categories = datas
      })
    });

    afterEach(() => {
      categories = null
    });

    it('should return an array of correct length', () => {
      expect(store.getAll('Category')).to.be.an('array').and.to.have.lengthOf(CATEGORY_LENGTH);
    });

    it('should be able to ascend in the nested tree to first ancestor', () => {
      let category = store.get('Category', CATEGORIES_ASCENDING_PATH[CATEGORIES_ASCENDING_PATH.length - 1]);
      let i = CATEGORIES_ASCENDING_PATH.length - 1; while (i--) {
        expect(category.parentId).to.equal(CATEGORIES_ASCENDING_PATH[i]);
        expect(category).to.have.property('parent');
        expect(category.parent).to.exist;
        expect(category.parent.id).to.equal(CATEGORIES_ASCENDING_PATH[i]);
        expect(category.parent.name).to.equal(CATEGORIES_NAME[CATEGORIES_ASCENDING_PATH[i]]);

        category = category.parent
      }

      expect(category.parent).to.be.null;
    });

    it('should correctly retain children', () => {
      let rootCategory = store.get('Category', ROOT_CATEGORY.ID);
      expect(rootCategory).to.have.property('children');
      expect(rootCategory.children).to.exist;
      expect(rootCategory.children).to.be.an('array').and.to.have.lengthOf(ROOT_CATEGORY.CHILDREN.length);
      
      let i = rootCategory.children.length; while (i--) {
        expect(ROOT_CATEGORY.CHILDREN).to.include(rootCategory.children[i].id);
      }
    });
  });
});