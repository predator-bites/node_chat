const toShow = ['author', 'text', 'roomId'];

export const normalize = (message: RawMessage) => {
  const newObj: Partial<RawMessage> = {}

  Object.entries(message).forEach(([key, value]) => {
    if (!toShow.includes(key) || typeof value !== 'string') {
      return;
    }

    newObj[key as keyof RawMessage] = value;
  })
}


