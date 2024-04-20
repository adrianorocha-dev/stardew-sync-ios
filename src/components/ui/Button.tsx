import type { ComponentRef } from "react";
import { forwardRef } from "react";
import type { PressableProps } from "react-native";
import { ActivityIndicator, Pressable, Text } from "react-native";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

import { cn } from "~/utils/cn";

const button = tv({
  base: "flex-row items-center justify-center rounded-lg px-10 py-3 transition-colors",
  variants: {
    intent: {
      primary: "bg-brand-500 active:bg-brand-700",
      danger: "bg-red-500 active:bg-red-700",
    },
  },
  defaultVariants: {
    intent: "primary",
  },
});

const text = tv({
  base: "text-lg text-center font-semibold",
  variants: {
    intent: {
      primary: "text-white",
      danger: "text-white",
    },
  },
  defaultVariants: {
    intent: "primary",
  },
});

type ButtonProps = PressableProps &
  VariantProps<typeof button> &
  VariantProps<typeof text> & {
    children: React.ReactNode;
    startIcon?: React.ReactNode;
    loading?: boolean;
  };

export const Button = forwardRef<ComponentRef<typeof Pressable>, ButtonProps>(
  function Button(
    {
      className,
      children,
      startIcon,
      loading = false,
      disabled = false,
      intent,
      ...props
    },
    ref,
  ) {
    return (
      <Pressable
        ref={ref}
        className={button({ intent, className })}
        disabled={(disabled ?? false) || loading}
        {...props}
      >
        {loading && <ActivityIndicator className="mr-2" color="white" />}

        {startIcon}

        {typeof children === "string" ? (
          <Text className={cn(text({ intent }), startIcon && "ml-2")}>
            {children}
          </Text>
        ) : (
          children
        )}
      </Pressable>
    );
  },
);
