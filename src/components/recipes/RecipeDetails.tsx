'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Recipe } from '@/helpers/types';
import { useStoreDispatch } from '@/store/store';
import { addRecipeToShoppingList } from '@/store/complexActions';
import { generalActions } from '@/store/generalState';
import { useRouter } from 'next/navigation';
import Dropdown from '../Dropdown';
import Link from 'next/link';
import ConfirmationModal from '../ConfirmationModal';
import { recipesActions } from '@/store/recipesState';
import useAuthenticator from '@/helpers/useAuthenticator';
import { fetchData } from '@/helpers/utils';
import RecipePageWrapper from './RecipePageWrapper';
import { AnimatePresence } from 'framer-motion';

export default function RecipeDetails({recipe}: {recipe: Recipe}) {
    const {authenticated} = useAuthenticator();
    const dispatch = useStoreDispatch();
    const router = useRouter();

    const top = useRef<HTMLDivElement>(null);
    const ddBtnRef = useRef<HTMLButtonElement>(null);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const toggleDropdown = useCallback(() => setDropdownVisible((prevState) => (!prevState)), [setDropdownVisible]);
    const toShoppingList = useCallback(() => dispatch(addRecipeToShoppingList(recipe.ingredients)), [recipe, dispatch]);
    const closeDeleteRecipeConfirm = useCallback(() => setIsModalVisible(false), [setIsModalVisible]);

    const onDeleteRecipe = useCallback(async ()=> {
        closeDeleteRecipeConfirm();

        dispatch(generalActions.setSubmitting(true));
        
        const response = await fetchData('/api/recipes', 'POST', {id: recipe.id});

        if ('error' in response) {
            dispatch(generalActions.flashToast({text: response.error, isError: true}));
        }
        else {
            dispatch(recipesActions.deleteRecipe(recipe.id));
            dispatch(generalActions.flashToast({text: 'Recipe deleted', isError: false}));
        }

        router.push('/recipes');
    }, [router, recipe, closeDeleteRecipeConfirm, dispatch]);

    const askDeleteRecipeConfirm = useCallback((recipe: Recipe) => setIsModalVisible(true), [setIsModalVisible]);

    useEffect(() => {
        if (top.current) top.current.scrollIntoView();
    }, [recipe]);

    return (<RecipePageWrapper>
        <div className="r" ref={top}>
            <div className="detail-header">
                <div className="detail-header-img">
                    <img src={recipe.imagePath} className="img-fluid" />
                </div>
                <div className="detail-header-text">
                    <div className="row flex-wrap g-2 justify-content-between mb-3 align-items-center">
                        <h1 className={authenticated ? 'col-8' : 'col-auto'}>{ recipe.name }</h1>
                        <div className="col-auto">
                            {authenticated && <div className="dropdown">
                                <button ref={ddBtnRef} className="btn btn-outline-light dropdown-toggle" onClick={toggleDropdown}>
                                    Manage
                                </button>
                                <Dropdown btn={ddBtnRef} isVisible={isDropdownVisible} onBgClick={toggleDropdown}>
                                    <div className='dropdown-item' onClick={toShoppingList}>To Shopping List</div>
                                    <Link className='dropdown-item' href={`/recipes/${recipe.id}/edit`}>Edit Recipe</Link>
                                    <div className='dropdown-item' onClick={askDeleteRecipeConfirm.bind(null, recipe)}>Delete Recipe</div>
                                </Dropdown>
                            </div>}
                        </div>
                    </div>
                    <div className="detail-desc">
                        <div>{recipe.description}</div>
                    </div>
                </div>
            </div>
            <div className="detail-block">
                <h5>Ingredients</h5>
                <ul className="list-group">
                    {recipe.ingredients.map((ing, i) => 
                        <li key={i} className="list-group-item">
                            <div className='row justify-content-between'>
                                <span className='col-auto'>{ing.name}</span>
                                <span className='col-auto'>{ing.amount} {ing.unit}</span>
                            </div>
                        </li>)}
                </ul>
            </div>
            <div className="detail-block">
                <h5>Steps</h5>
                <ol className="list-group list-group-flush list-group-numbered">
                    { recipe.steps.map((step, i) => <li key={i} className="list-group-item">{step}</li>)}
                </ol>
            </div>
            <AnimatePresence>
                {authenticated && isModalVisible && <ConfirmationModal 
                    question="Delete recipe" 
                    itemName={recipe.name} 
                    onConfirm={onDeleteRecipe} 
                    onClose={closeDeleteRecipeConfirm}/>}
            </AnimatePresence>
        </div>
    </RecipePageWrapper>)
};