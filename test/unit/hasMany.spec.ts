import { User, UserProfile } from '../resources'
import { expect } from 'chai';

describe('belongsTo', () => {
  xit("should retrieve competency which include category", () => {
    return User.findAll({
      include: 'category'
    }).then((competencies:Array<any>) => {
      expect(competencies).to.be.an('array').and.to.have.lengthOf(1);

      let competency:any = competencies[0];
      expect(competency).to.have.property('category');
      expect(competency.id).to.equal('e81fea3d-6379-4137-8068-7d70a90a1a7c');
      expect(competency.title).to.equal('Course Competency test');

      expect(competency.category).to.exist;
      expect(competency.category.id).to.equal('fa4ea433-5786-46c3-ab63-079fec1c488a');
      expect(competency.category.title).to.equal('Course Category Test');

      let categories:Array<any> = UserProfile.getAll();
      expect(categories).to.have.lengthOf(1);
      expect(categories[0].id).to.equal('fa4ea433-5786-46c3-ab63-079fec1c488a');
      expect(categories[0].title).to.equal('Course Category Test');
    })
  })
});