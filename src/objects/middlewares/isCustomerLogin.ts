import jwt from 'jsonwebtoken';

interface Request {
  get: (header: string) => string | undefined;
  userId?: string;
}

interface Response {
}

interface NextFunction {
  (err?: any): void;
}

interface DecodedToken {
  userId: string;
}

const isLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      const error = new Error('Not Authorized');
      (error as any).statusCode = 401;
      throw error;
    }

    const token = authHeader.split(' ')[1];
    let decodedToken: DecodedToken;
    decodedToken = jwt.verify(token,`${process.env.MEMBER_SECRET_ACCESS_KEY}`) as DecodedToken;
  
    if (!decodedToken) {
      const error = new Error('Not authenticated.');
      (error as any).statusCode = 401;
      throw error;
    }
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    if (!(err as any).statusCode) {
      (err as any).statusCode = 500;
    }
    next(err);
  }
};

export default isLogin;
