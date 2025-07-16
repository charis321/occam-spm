import { useState } from 'react'
import OCConfirm from '../../components/OCCommon/OCConfirm'

export const useConfirm = ()=>{
  const [confirmProps, setConfirmProps] = useState(null);
  const showConfirm = (content, onConfirm, onCancel) => {
    setConfirmProps({
      content,
      onConfirm: () => {
        setConfirmProps(null);
        onConfirm && onConfirm();
      },
      onCancel: () => {
        setConfirmProps(null);
        onCancel && onCancel();
      }
    });
  };
  const confirmElement = confirmProps ? (
    <OCConfirm {...confirmProps}/>
  ) : null;
  return [showConfirm, confirmElement];
}