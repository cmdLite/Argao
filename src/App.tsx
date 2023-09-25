import { useEffect } from 'react';
import List from './components/List';
import { useAppDispatch } from './store/store';
import { fetchData } from './store/features/dataSlice';

function App(){
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchData()); // useDispatch from redux store
  });
return(
  <div>
    <List/> {/* Call List Component */}
  </div>
)
}
export default App;