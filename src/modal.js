import { CheckboxControl, Button, Modal, TextControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';


export const MyModal = (props) => {

    const [ answers, setAnswers] = useState([]);
    const { title } = props;

    return <Modal title={title} onRequestClose={() => console.log('CLOSE')}></Modal>;

    return <Modal title={title} onRequestClose={() => console.log('CLOSE')}>
        <TextControl label="Question" value='' onChange={(value) => console.log(value)} />
        {answers.map((answer) => <TextControl value={answer} onChange={(value) => console.log(value)} />)}
        <Button onClick={() => setAnswers(answers.concat('Answer'))}>Click</Button>
        <Button onClick={() => console.log('OK')}>OK</Button>
    </Modal>;
}