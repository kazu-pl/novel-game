import { ActExtended } from "types/novel-server.types";

const getUniqueListOfActImgs = (act: ActExtended) => {
  const imgsList: string[] = act.scenes.reduce((prevImgs, currentScene) => {
    const currentSceneImg = currentScene.bgImg.link;

    const currentSceneDialogCharactersImgs = currentScene.dialogs.reduce(
      (prevDialogImgs, currentDialog) => {
        const currentdialogCharacterImages =
          currentDialog.charactersOnScreen.reduce(
            (prevCharacters, currentCharacter) => {
              return prevCharacters.includes(currentCharacter.imgUrl)
                ? prevCharacters
                : [...prevCharacters, currentCharacter.imgUrl];
            },
            [] as string[]
          );

        return [...prevDialogImgs, ...currentdialogCharacterImages];
      },
      [] as string[]
    );

    return prevImgs.includes(currentSceneImg)
      ? [...prevImgs, ...currentSceneDialogCharactersImgs]
      : [...prevImgs, currentSceneImg, ...currentSceneDialogCharactersImgs];
  }, [] as string[]);

  const uniqueImgsList = Array.from(new Set(imgsList).values());

  return uniqueImgsList;
};

export default getUniqueListOfActImgs;
