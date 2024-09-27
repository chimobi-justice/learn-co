import { Fragment, useState } from 'react'
import { Box, useDisclosure } from '@chakra-ui/react'

import { Alert, ArticlesCard, Button, Skeleton } from '@components/index'
import { useDeleteArticle } from '@hooks/article/useDeleteArticle'
import { useGetRecommentedArticles } from '@hooks/article/useGetRecommentedArticles'

const ForYou = () => {
  const {
    articles,
    isLoading,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useGetRecommentedArticles(20)

  const { deleteArticleMutation } = useDeleteArticle()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteArticleId, setDeleteArticleId] = useState(null);

  const handleDelete = (articleId: any) => {
    setDeleteArticleId(articleId)
    onOpen()
  }

  const handleDeleteArticle = () => {
    if (!deleteArticleId) return;
    deleteArticleMutation.mutate(deleteArticleId)
    onClose()
  }

  return (
    <>
      {isLoading && <Skeleton />}

      {articles && isSuccess && articles?.map((page: any, pageIndex: number) => (
        <Fragment key={pageIndex}>
          {page?.data?.articles.map((article: any, index: number) => (
            <ArticlesCard
              key={index}
              id={article?.id}
              articleImg={article?.thumbnail}
              title={article?.title}
              description={article?.content}
              read_time={article?.read_time}
              CTA={`/articles/${article?.slug}/${article?.id}`}
              isOwner={article?.isOwner}
              authorAvatar={article?.author?.avatar}
              authorFullname={article?.author?.fullname}
              authorUsername={article?.author?.username}
              onDelete={() => handleDelete(article?.id)}
            />
          ))}
        </Fragment>
      ))}

      {hasNextPage && (
        <Box textAlign={"center"} mt={"25px"}>
          <Button
            size="lg"
            rounded="md"
            type="button"
            variant="solid"
            onClick={fetchNextPage}
            isDisabled={!hasNextPage && isFetchingNextPage}
          >
            {isFetchingNextPage
              ? "Loading more.."
              : hasNextPage
                ? "Load More"
                : "Nothing more to load"
            }
          </Button>
        </Box>
      )}

      <Alert
        isOpen={isOpen}
        onClose={onClose}
        alertHeader="Delete Article"
        alertBody="Are you sure? You can't undo this action afterwards."
        handleDelete={handleDeleteArticle}
        isLoading={deleteArticleMutation.isPending}
      />
    </>
  )
}

export default ForYou;