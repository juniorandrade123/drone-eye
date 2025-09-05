
import * as React from "react"
import InputMask from "react-input-mask"
import { cn } from "@/lib/utils"


type MaskType = "cpf" | "cnpj" | "telefone" | "cep"

const maskMap: Record<MaskType, string> = {
  cpf: "999.999.999-99",
  cnpj: "99.999.999/9999-99",
  telefone: "(99) 99999-9999",
  cep: "99999-999"
}

interface InputProps extends React.ComponentProps<"input"> {
  maskType?: MaskType
  onlyNumber?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, maskType, onlyNumber, ...props }, ref) => {
    const mask = maskType ? maskMap[maskType] : undefined

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (onlyNumber && !/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
      if (props.onKeyPress) {
        props.onKeyPress(e);
      }
    };

    if (mask) {
      return (
        <InputMask
          mask={mask}
          autoComplete="new-password"
          type={type}
          {...props}
          inputRef={ref}
        >
          {(inputProps: any) => (
            <input
              {...inputProps}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                className
              )}
              onKeyPress={handleKeyPress}
            />
          )}
        </InputMask>
      )
    }
    return (
      <input
        autoComplete="new-password"
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
        onKeyPress={handleKeyPress}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }