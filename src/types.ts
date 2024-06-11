export type SignInResponse = {
  data: {
    token: string;
  };
};

export type StartProfileResponse = {
  status: {
    message: string;
  };
};

export type MultiloginOptions = {
  folderId: string;
  profileId: string;
};

export type SignInArgs = {
  email: string;
  password: string;
};
