import type { HTMLAttributes } from 'react';
import React, { useState } from 'react';

import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { Copy, Sparkles } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';

import { useCopyShareLink } from '@documenso/lib/client-only/hooks/use-copy-share-link';
import { NEXT_PUBLIC_WEBAPP_URL } from '@documenso/lib/constants/app';
import { generateTwitterIntent } from '@documenso/lib/universal/generate-twitter-intent';
import { trpc } from '@documenso/trpc/react';

import { cn } from '../../lib/utils';
import { Button } from '../../primitives/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../primitives/dialog';
import { useToast } from '../../primitives/use-toast';

export type DocumentShareButtonProps = HTMLAttributes<HTMLButtonElement> & {
  token?: string;
  documentId: number;
  trigger?: (_props: { loading: boolean; disabled: boolean }) => React.ReactNode;
};

export const DocumentShareButton = ({
  token,
  documentId,
  className,
  trigger,
}: DocumentShareButtonProps) => {
  const { _ } = useLingui();
  const { toast } = useToast();

  const { copyShareLink, createAndCopyShareLink, isCopyingShareLink } = useCopyShareLink({
    onSuccess: () =>
      toast({
        title: _(msg`Copied to clipboard`),
        description: _(msg`The sharing link has been copied to your clipboard.`),
      }),
    onError: () =>
      toast({
        title: _(msg`Something went wrong`),
        description: _(msg`The sharing link could not be created at this time. Please try again.`),
        variant: 'destructive',
        duration: 5000,
      }),
  });

  const [isOpen, setIsOpen] = useState(false);

  const {
    mutateAsync: createOrGetShareLink,
    data: shareLink,
    isPending: isCreatingOrGettingShareLink,
  } = trpc.document.share.useMutation();

  const isLoading = isCreatingOrGettingShareLink || isCopyingShareLink;

  const onOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      void createOrGetShareLink({
        token,
        documentId,
      });
    }

    setIsOpen(nextOpen);
  };

  const onCopyClick = async () => {
    if (shareLink) {
      await copyShareLink(`${NEXT_PUBLIC_WEBAPP_URL()}/share/${shareLink.slug}`);
    } else {
      await createAndCopyShareLink({
        token,
        documentId,
      });
    }

    setIsOpen(false);
  };

  const onTweetClick = async () => {
    let { slug = '' } = shareLink || {};

    if (!slug) {
      const result = await createOrGetShareLink({
        token,
        documentId,
      });

      slug = result.slug;
    }

    // Ensuring we've prewarmed the opengraph image for the Twitter
    await fetch(`${NEXT_PUBLIC_WEBAPP_URL()}/share/${slug}/opengraph`, {
      // We don't care about the response, so we can use no-cors
      mode: 'no-cors',
    });

    window.open(
      generateTwitterIntent(
        `I just ${token ? 'signed' : 'sent'} a document in style with @documenso. Check it out!`,
        `${NEXT_PUBLIC_WEBAPP_URL()}/share/${slug}`,
      ),
      '_blank',
    );

    setIsOpen(false);
  };

  return null;
};
