import { useForm } from "@tanstack/react-form";
import { useServerFn } from "@tanstack/react-start";
import { CheckIcon, ChevronDownIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { submitWaitlistForm } from "@/lib/waitlist.functions";
import { waitlistEmailOnBlurSchema, waitlistSchema } from "@/lib/waitlist-schema";
import type { WaitlistFormValues } from "@/lib/waitlist-schema";

const defaultValues: WaitlistFormValues = {
  email: "",
  name: "",
  company: "",
  role: "",
  currentAi: "",
  aiFeelings: "",
  aiEraChange: "",
};

export function WaitlistDialog({ triggerClassName }: { triggerClassName?: string }) {
  const submitWaitlist = useServerFn(submitWaitlistForm);
  const [submission, setSubmission] = useState<{ name: string } | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: waitlistSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmissionError(null);

      try {
        const result = await submitWaitlist({ data: waitlistSchema.parse(value) });
        setSubmission(result);
      } catch {
        setSubmissionError("We couldn't save your submission. Please try again.");
      }
    },
  });

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          form.reset();
          setSubmission(null);
          setSubmissionError(null);
          setDetailsOpen(false);
        }
      }}
    >
      <DialogTrigger render={<Button type="button" variant="ghost" className={triggerClassName} />}>
        <PlusIcon aria-hidden="true" className="size-4" />
        Waitlist
      </DialogTrigger>

      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-5 overflow-y-auto sm:max-w-xl">
        {submission ? (
          <div className="flex flex-col items-center gap-5 py-5 text-center" aria-live="polite">
            <div className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground">
              <CheckIcon aria-hidden="true" className="size-5" />
            </div>
            <DialogHeader className="items-center">
              <DialogTitle className="text-lg leading-6 font-semibold">
                Thanks{submission.name ? `, ${submission.name}` : ""}.
              </DialogTitle>
              <DialogDescription className="text-sm leading-5">
                We appreciate your interest in Chance Journey.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button type="button" />}>Done</DialogClose>
            </DialogFooter>
          </div>
        ) : (
          <>
            <DialogHeader className="pr-8">
              <DialogTitle className="text-lg leading-6 font-semibold">
                Join the waitlist
              </DialogTitle>
              <DialogDescription className="text-sm leading-5">
                Leave your email and, if you like, tell us a little about yourself.
              </DialogDescription>
            </DialogHeader>

            <form
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void form.handleSubmit();
              }}
            >
              <FieldGroup className="gap-4">
                <form.Field name="email" validators={{ onBlur: waitlistEmailOnBlurSchema }}>
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name} className="text-sm leading-5">
                          Email{" "}
                          <span aria-hidden="true" className="text-destructive">
                            *
                          </span>
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="email"
                          autoComplete="email"
                          maxLength={320}
                          placeholder="you@company.com"
                          className="placeholder:text-sm placeholder:leading-5"
                          required
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => field.handleChange(event.target.value)}
                          aria-invalid={isInvalid}
                          aria-describedby={isInvalid ? `${field.name}-error` : undefined}
                        />
                        {isInvalid && (
                          <FieldError id={`${field.name}-error`} errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <form.Field name="name">
                    {(field) => {
                      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field data-invalid={isInvalid} className="gap-2">
                          <FieldLabel htmlFor={field.name} className="text-sm leading-5">
                            Name
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            autoComplete="name"
                            maxLength={100}
                            placeholder="John Doe"
                            className="placeholder:text-sm placeholder:leading-5"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) => field.handleChange(event.target.value)}
                            aria-invalid={isInvalid}
                            aria-describedby={isInvalid ? `${field.name}-error` : undefined}
                          />
                          {isInvalid && (
                            <FieldError
                              id={`${field.name}-error`}
                              errors={field.state.meta.errors}
                            />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>

                  <form.Field name="company">
                    {(field) => {
                      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field data-invalid={isInvalid} className="gap-2">
                          <FieldLabel htmlFor={field.name} className="text-sm leading-5">
                            Company
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            autoComplete="organization"
                            maxLength={100}
                            placeholder="Acme Inc."
                            className="placeholder:text-sm placeholder:leading-5"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) => field.handleChange(event.target.value)}
                            aria-invalid={isInvalid}
                            aria-describedby={isInvalid ? `${field.name}-error` : undefined}
                          />
                          {isInvalid && (
                            <FieldError
                              id={`${field.name}-error`}
                              errors={field.state.meta.errors}
                            />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                </div>

                <form.Field name="role">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name} className="text-sm leading-5">
                          Role
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          autoComplete="organization-title"
                          maxLength={100}
                          placeholder="Founder"
                          className="placeholder:text-sm placeholder:leading-5"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => field.handleChange(event.target.value)}
                          aria-invalid={isInvalid}
                          aria-describedby={isInvalid ? `${field.name}-error` : undefined}
                        />
                        {isInvalid && (
                          <FieldError id={`${field.name}-error`} errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen} className="w-full">
                  <div className="relative flex h-8 items-center justify-center">
                    <Separator className="absolute inset-x-0 top-1/2" />
                    <CollapsibleTrigger
                      render={
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="group relative z-10 rounded-full bg-popover px-3 text-sm leading-5 font-normal text-muted-foreground shadow-none hover:bg-popover hover:text-foreground aria-expanded:bg-popover dark:hover:bg-popover"
                        />
                      }
                    >
                      Tell us more
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="size-3.5 transition-transform duration-200 group-data-panel-open:rotate-180 motion-reduce:transition-none"
                      />
                    </CollapsibleTrigger>
                  </div>

                  <CollapsibleContent className="-mx-1 h-[var(--collapsible-panel-height)] overflow-hidden px-1 transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none [&[hidden]:not([hidden='until-found'])]:hidden">
                    <FieldGroup className="gap-4 pt-3 pb-1">
                      <form.Field name="currentAi">
                        {(field) => {
                          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                          return (
                            <Field data-invalid={isInvalid} className="gap-2">
                              <FieldLabel htmlFor={field.name} className="text-sm leading-5">
                                What AI are you currently using?
                              </FieldLabel>
                              <Textarea
                                id={field.name}
                                name={field.name}
                                rows={2}
                                maxLength={300}
                                placeholder="ChatGPT, Codex CLI, Claude, Claude Code, Pi, OpenCode, etc."
                                className="max-h-32 resize-y placeholder:text-sm placeholder:leading-5"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) => field.handleChange(event.target.value)}
                                aria-invalid={isInvalid}
                                aria-describedby={isInvalid ? `${field.name}-error` : undefined}
                              />
                              {isInvalid && (
                                <FieldError
                                  id={`${field.name}-error`}
                                  errors={field.state.meta.errors}
                                />
                              )}
                            </Field>
                          );
                        }}
                      </form.Field>

                      <form.Field name="aiFeelings">
                        {(field) => {
                          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                          return (
                            <Field data-invalid={isInvalid} className="gap-2">
                              <FieldLabel htmlFor={field.name} className="text-sm leading-5">
                                Tell us about your feelings about them
                              </FieldLabel>
                              <Textarea
                                id={field.name}
                                name={field.name}
                                rows={3}
                                maxLength={1000}
                                placeholder="What works well? What feels frustrating?"
                                className="max-h-40 resize-y placeholder:text-sm placeholder:leading-5"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) => field.handleChange(event.target.value)}
                                aria-invalid={isInvalid}
                                aria-describedby={isInvalid ? `${field.name}-error` : undefined}
                              />
                              {isInvalid && (
                                <FieldError
                                  id={`${field.name}-error`}
                                  errors={field.state.meta.errors}
                                />
                              )}
                            </Field>
                          );
                        }}
                      </form.Field>

                      <form.Field name="aiEraChange">
                        {(field) => {
                          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                          return (
                            <Field data-invalid={isInvalid} className="gap-2">
                              <FieldLabel htmlFor={field.name} className="text-sm leading-5">
                                What do you think is the most significant change in AI era?
                              </FieldLabel>
                              <Textarea
                                id={field.name}
                                name={field.name}
                                rows={3}
                                maxLength={1000}
                                placeholder="Share your perspective..."
                                className="max-h-40 resize-y placeholder:text-sm placeholder:leading-5"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) => field.handleChange(event.target.value)}
                                aria-invalid={isInvalid}
                                aria-describedby={isInvalid ? `${field.name}-error` : undefined}
                              />
                              {isInvalid && (
                                <FieldError
                                  id={`${field.name}-error`}
                                  errors={field.state.meta.errors}
                                />
                              )}
                            </Field>
                          );
                        }}
                      </form.Field>
                    </FieldGroup>
                  </CollapsibleContent>
                </Collapsible>
              </FieldGroup>

              {submissionError && (
                <p role="alert" className="mt-4 text-sm leading-5 text-destructive">
                  {submissionError}
                </p>
              )}

              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <DialogFooter className="mt-6">
                    <Button
                      type="submit"
                      className="w-full sm:w-auto"
                      disabled={isSubmitting}
                      aria-busy={isSubmitting}
                    >
                      {isSubmitting ? "Joining..." : "Join waitlist"}
                    </Button>
                  </DialogFooter>
                )}
              </form.Subscribe>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
