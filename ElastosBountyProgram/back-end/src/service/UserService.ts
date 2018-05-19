import Base from './Base';
import {Document} from 'mongoose';
import * as _ from 'lodash';
import {constant} from '../constant';
import {validate, crypto} from '../utility';

const {USER_ROLE} = constant;

export default class extends Base {
    public async registerNewUser(param): Promise<Document>{
        const db_user = this.getDBModel('User');

        this.validate_username(param.username);
        this.validate_password(param.password);
        this.validate_email(param.email);

        const doc = {
            username : param.username,
            password : crypto.sha512(param.password),
            email : param.email,
            profile : {
                firstName : param.profile.region.firstName,
                lastName : param.profile.region.lastName,
                country : param.profile.region.country,
                city : param.profile.region.city
            },
            role : USER_ROLE.MEMBER,
            active: true
        };

        return await db_user.save(doc);
    }

    public async findUser(query): Promise<Document>{
        const db_user = this.getDBModel('User');
        return await db_user.findOne({
            username: query.username,
            password: query.password
        });
    }

    public async changePassword(param): Promise<boolean>{
        const db_user = this.getDBModel('User');

        const {oldPassword, password, userId} = param;

        this.validate_password(oldPassword);
        this.validate_password(password);

        const user = await db_user.findOne({_id: userId}, {reject: false});
        if(!user){
            throw 'user is not exist';
        }

        if(user.password !== crypto.sha512(oldPassword)){
            throw 'old password is incorrect';
        }

        return await db_user.update({_id : userId}, {
            $set : {
                password : crypto.sha512(password)
            }
        });
    }

    /*
    * return ela budget sum amount.
    *
    * param : user's elaBudget
    * */
    public getSumElaBudget(ela){
        let total = 0;
        _.each(ela, ()=>{
            total += ela.amount;
        });

        return total;
    }

    public validate_username(username){
        if(!validate.valid_string(username, 5)){
            throw 'invalid username';
        }
    }
    public validate_password(password){
        if(!validate.valid_string(password, 6)){
            throw 'invalid password';
        }
    }
    public validate_email(email){
        if(!validate.email(email)){
            throw 'invalid email';
        }
    }
}
