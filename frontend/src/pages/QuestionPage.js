import React from 'react';

import GlobalNavbar from '../components/GlobalNavbar';
import QuestionForum from '../components/QuestionForum';
import ChooseAnswer from '../components/ChooseAnswer';

const QuestionPage = () => {
    return (
        <div>
            <GlobalNavbar />
            <ChooseAnswer />
            <QuestionForum />
        </div>
    );
}

export default QuestionPage;
