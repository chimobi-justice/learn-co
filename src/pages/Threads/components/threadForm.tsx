import { FormEvent, FunctionComponent, useEffect, useState } from 'react'
import { Box, FormControl, Input } from '@chakra-ui/react'

import { Button, Editor } from '@components/index'
import { useCreateThread } from '@hooks/thread/useCreateThread'
import { useEditThread } from '@hooks/thread/useEditThread'
import { ThreadRequest } from '@api/index'

interface ThreadFormProps {
  titleValue?: string;
  contentValue?: string;
  isEditing?: boolean
  id?: any
}

const ThreadForm: FunctionComponent<ThreadFormProps> = ({
  titleValue = '',
  contentValue = '',
  isEditing,
  id
}) => {
  const [title, setTitle] = useState<string>(titleValue);
  const [content, setContent] = useState<string>(contentValue);

  const { createThreadMutation } = useCreateThread();
  const { editThreadMutation } = useEditThread();

  const handleSubmitThread = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const threadData: ThreadRequest = {
      title,
      content
    };

    if (isEditing && id) {
      editThreadMutation.mutate({ data: threadData, id });
    } else {
      createThreadMutation.mutate(threadData);
    }
  };

  useEffect(() => {
    if (isEditing && titleValue && contentValue) {
      setContent(contentValue || '');
      setTitle(titleValue || '');
    }
  }, [titleValue, contentValue, isEditing]);

  return (
    <Box width={{ base: "98%", md: "50%" }} m={"2rem auto"}>
      <form onSubmit={handleSubmitThread}>
        <FormControl my={"2.5rem"}>
          <Input
            type="text"
            py="60px"
            size="lg"
            fontSize="3rem"
            variant="flushed"
            colorScheme="gray"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>

        <Box height={"400px"}>
          <Editor
            content={content}
            setContent={setContent}
            placeholder="write here to post threads"
          />
        </Box>

        <Box textAlign={"right"} my={"25px"}>
          <Button
            variant="solid"
            size={{ base: "md", lg: "lg" }}
            width={{ base: "100%", lg: "auto" }}
            type="submit"
            fontWeight={"semibold"}
            rounded="sm"
            isDisabled={!title || !content}
            isloading={isEditing ? editThreadMutation.isPending : createThreadMutation.isPending}
          >
            {isEditing ? "Update" : "Save"}
          </Button>
        </Box>
      </form>

    </Box>
  )
}

export default ThreadForm;