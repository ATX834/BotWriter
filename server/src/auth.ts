import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from './models/User';

export const customAuthChecker = async ({ root, args, context, info }) => {

    const userRepository = getRepository(User)
    const token = context.token;
    try {
        const decoded = jwt.verify(token, process.env.JWT_LOGIN);
        if (!decoded.id) {
            return false;
        }
        
        const user = await userRepository.findOne(decoded.id);
        if (!user) {
            return false;
        }
        
        context.user = user;
        return true;
    } catch (e) {
        return false;
    }
}