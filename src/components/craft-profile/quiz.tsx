"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useToast } from "~/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Label } from "~/components/ui/label";
import { Card, CardContent } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

type QuizQuestion = {
  quizId?: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: string;
  sectionId: string;
};

type QuestionFormProps = {
  onSave: (question: Omit<QuizQuestion, "quizId">) => void;
  initialQuestion?: QuizQuestion;
  onClose: () => void;
  sectionId: string;
};

const QuestionForm = ({
  onSave,
  initialQuestion,
  onClose,
  sectionId,
}: QuestionFormProps) => {
  const [question, setQuestion] = useState<Omit<QuizQuestion, "quizId">>(
    initialQuestion ?? {
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      answer: "",
      sectionId: sectionId,
    },
  );

  const handleSave = () => {
    if (!question.question.trim() || !question.answer.trim()) {
      return;
    }
    onSave(question);
    onClose();
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Question</Label>
        <Input
          placeholder="Enter your question"
          value={question.question}
          onChange={(e) =>
            setQuestion({ ...question, question: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Options</Label>
        {["option1", "option2", "option3", "option4"].map((option, index) => (
          <div key={option} className="flex items-center space-x-2">
            <Input
              placeholder={`Option ${index + 1}`}
              value={question[option as keyof typeof question]}
              onChange={(e) =>
                setQuestion({ ...question, [option]: e.target.value })
              }
            />
          </div>
        ))}
      </div>

      <div>
        <Label>Correct Answer</Label>
        <Input
          placeholder="Enter the correct answer (match exactly with one of the options)"
          value={question.answer}
          onChange={(e) => setQuestion({ ...question, answer: e.target.value })}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Question</Button>
      </div>
    </div>
  );
};

type QuizComponentProps = {
  sectionId: string;
};

export const ProfileSectionMCQ = ({ sectionId }: QuizComponentProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(
    null,
  );

  // Fetch existing quiz questions
  const utils = api.useUtils();
  const { data: questions = [] } = api.craft.getSectionQuestions.useQuery({
    sectionId,
  });

  const addQuestion = api.craft.createQuestion.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success",
        description: "Question saved successfully",
      });
      await utils.craft.getSectionQuestions.invalidate({ sectionId });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save question",
        variant: "destructive",
      });
    },
  });

  const updateQuestion = api.craft.updateQuestion.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success",
        description: "Question updated successfully",
      });
      await utils.craft.getSectionQuestions.invalidate({ sectionId });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update question",
        variant: "destructive",
      });
    },
  });

  const deleteQuestion = api.craft.deleteQuestion.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success",
        description: "Question deleted successfully",
      });
      await utils.craft.getSectionQuestions.invalidate({ sectionId });
    },
  });

  const handleSaveQuestion = async (
    questionData: Omit<QuizQuestion, "quizId">,
  ) => {
    if (editingQuestion?.quizId) {
      updateQuestion.mutate({
        quizId: editingQuestion.quizId,
        ...questionData,
      });
    } else {
      addQuestion.mutate(questionData);
    }
    setIsDialogOpen(false);
    setEditingQuestion(null);
  };

  const handleEditQuestion = (question: QuizQuestion) => {
    setEditingQuestion(question);
    setIsDialogOpen(true);
  };

  const handleDeleteQuestion = (quizId: string) => {
    deleteQuestion.mutate({ quizId });
  };

  return (
    <div className="mt-6 space-y-6 border-t pt-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-muted-foreground">
          Section MCQ Quiz
        </h4>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              onClick={() => {
                setEditingQuestion(null);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingQuestion ? "Edit Question" : "Add New Question"}
              </DialogTitle>
            </DialogHeader>
            <QuestionForm
              onSave={handleSaveQuestion}
              initialQuestion={editingQuestion ?? undefined}
              onClose={() => {
                setIsDialogOpen(false);
                setEditingQuestion(null);
              }}
              sectionId={sectionId}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <Card key={question.quizId} className="p-4">
            <CardContent>
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base">Question {index + 1}:</Label>
                    <p className="mt-1">{question.question}</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      question.option1,
                      question.option2,
                      question.option3,
                      question.option4,
                    ].map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`flex items-center space-x-2 ${
                          option === question.answer
                            ? "font-medium text-green-600"
                            : ""
                        }`}
                      >
                        <div className="w-6">{optIndex + 1}.</div>
                        <div>{option}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditQuestion(question)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteQuestion(question.quizId)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
