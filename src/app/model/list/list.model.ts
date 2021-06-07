import {Card} from '../card/card.model';
import {User} from '../user/user.model';
import {Tag} from '../tag/tag';

export class List {
    id: string;
    title: string;
    cards: Card[];
    owner: User;
    background: string;
    creationDate: string;
    tags: Tag[];
}

