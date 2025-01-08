import { TestBed } from '@angular/core/testing';

import { UserTeamsService } from './user-teams.service';

describe('UserTeamsService', () => {
  let service: UserTeamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserTeamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
