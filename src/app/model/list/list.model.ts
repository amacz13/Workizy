import {Card} from '../card/card.model';
import {User} from '../user/user.model';

export class List {
    id: number;
    title: string;
    cards: Card[];
    owner: User;
    background: string;
}

